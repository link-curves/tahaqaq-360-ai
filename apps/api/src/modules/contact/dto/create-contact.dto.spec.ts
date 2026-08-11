import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateContactDto } from './create-contact.dto';

/**
 * Regression tests for the public contact endpoint.
 *
 * The pipe below is configured IDENTICALLY to the global one in main.ts, so
 * these assert the real contract rather than a convenient approximation. If
 * main.ts ever changes, this file should change with it.
 *
 * History: this endpoint previously typed its body as
 * `Prisma.ContactMessageCreateInput`. A Prisma type carries no class metadata,
 * so `whitelist` / `forbidNonWhitelisted` had nothing to work from and every
 * column on ContactMessage was settable by an anonymous request — verified
 * exploitable on 2026-08-04.
 */
describe('CreateContactDto (public contact form)', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });

  const meta = {
    type: 'body' as const,
    metatype: CreateContactDto,
    data: '',
  };

  const valid = {
    name: 'Real Person',
    email: 'real@example.com',
    subject: 'Question',
    message: 'Hello',
  };

  const submit = (payload: unknown) => pipe.transform(payload, meta);

  it('accepts a legitimate submission', async () => {
    await expect(submit(valid)).resolves.toMatchObject(valid);
  });

  it('accepts an optional phone number', async () => {
    await expect(
      submit({ ...valid, phone: '+9611234567' }),
    ).resolves.toMatchObject({ phone: '+9611234567' });
  });

  describe('privilege escalation is rejected', () => {
    // These columns are staff-controlled. An anonymous submitter must never
    // be able to set them.
    it.each([
      ['status', 'RESOLVED'],
      ['response', 'FORGED staff reply'],
      ['respondedBy', 'admin-impersonated'],
      ['respondedAt', new Date().toISOString()],
      ['userId', 'some-other-users-id'],
      ['id', 'attacker-chosen-id'],
    ])('rejects a payload carrying `%s`', async (field, value) => {
      await expect(submit({ ...valid, [field]: value })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects the exact payload that was exploitable before the fix', async () => {
      await expect(
        submit({
          ...valid,
          status: 'RESOLVED',
          response: 'FORGED staff reply',
          respondedBy: 'admin-impersonated',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('field validation', () => {
    it.each(['name', 'email', 'subject', 'message'])(
      'requires `%s`',
      async (field) => {
        const payload = { ...valid };
        delete (payload as Record<string, unknown>)[field];

        await expect(submit(payload)).rejects.toThrow(BadRequestException);
      },
    );

    it('rejects a malformed email', async () => {
      await expect(submit({ ...valid, email: 'not-an-email' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects an empty message', async () => {
      await expect(submit({ ...valid, message: '' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects an oversized message', async () => {
      await expect(
        submit({ ...valid, message: 'x'.repeat(5001) }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
