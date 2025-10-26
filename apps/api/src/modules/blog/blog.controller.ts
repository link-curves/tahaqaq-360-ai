import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blog posts (public)' })
  @ApiResponse({ status: 200, description: 'Returns paginated blog posts' })
  findAll(@Query() filterDto: FilterBlogDto) {
    return this.blogService.findAll(filterDto);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all blog categories (public)' })
  @ApiResponse({ status: 200, description: 'Returns unique categories' })
  getCategories() {
    return this.blogService.getCategories();
  }

  @Public()
  @Get('tags')
  @ApiOperation({ summary: 'Get all blog tags (public)' })
  @ApiResponse({ status: 200, description: 'Returns unique tags' })
  getTags() {
    return this.blogService.getTags();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single blog post by slug (public)' })
  @ApiResponse({ status: 200, description: 'Returns blog post' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new blog post (admin/moderator)' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog post (admin/moderator)' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
