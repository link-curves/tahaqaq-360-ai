import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { GoogleAuthGuard } from '../../common/guards/google-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // req.user comes from GoogleStrategy.validate()
    const { accessCookieOptions, refreshCookieOptions, token, refreshToken } =
      await this.authService.handleGoogleLogin(req.user as any);

    // Set httpOnly JWT cookies
    res.cookie('access_token', token, accessCookieOptions);
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    // Optional: Set a non-httpOnly flag for UI state management
    res.cookie('logged_in', 'true', {
      ...accessCookieOptions,
      httpOnly: false, // This one can be read by JS for UI state
      maxAge: accessCookieOptions.maxAge,
    });

    // Redirect back to your web app
    const successUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return res.redirect(`${successUrl}/auth/success`);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using cookie' })
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Refresh token not found',
      });
    }

    try {
      const tokens = await this.authService.refreshTokens(refreshToken);

      // Set new access token cookie
      const accessCookieOptions = {
        httpOnly: true,
        secure: this.config.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax' as const,
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      };

      res.cookie('access_token', tokens.accessToken, accessCookieOptions);

      return res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
      // Clear invalid refresh token
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      res.clearCookie('logged_in');

      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid refresh token',
      });
    }
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  async logout(@CurrentUser('id') userId: string, @Res() res: Response) {
    await this.authService.logout(userId);

    // Clear all auth cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('logged_in');

    return res.json({ message: 'Logged out successfully' });
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return { user };
  }
}
