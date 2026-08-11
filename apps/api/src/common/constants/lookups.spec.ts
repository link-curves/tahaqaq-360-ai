import { DEFAULT_LOCALE, LOOKUP_REGISTRY, resolveLocalized } from './lookups';

/**
 * `resolveLocalized` is the single place a `LocalizedText` map becomes a string,
 * so its fallback behaviour is the difference between a partially translated
 * locale degrading gracefully and the UI rendering blank chips (ADR-0008).
 */
describe('resolveLocalized', () => {
  const labels = { ar: 'صحيح', en: 'True' };

  it('returns the requested language', () => {
    expect(resolveLocalized(labels, 'EN')).toBe('True');
    expect(resolveLocalized(labels, 'AR')).toBe('صحيح');
  });

  it('is case-insensitive about the locale code', () => {
    // Route params arrive uppercase; the map keys are lowercase.
    expect(resolveLocalized(labels, 'en')).toBe('True');
    expect(resolveLocalized(labels, 'En')).toBe('True');
  });

  describe('a third language added later', () => {
    // The whole point of the JSON map: French is a key, not a migration.
    const withFrench = { ...labels, fr: 'Vrai' };

    it('resolves once the key exists', () => {
      expect(resolveLocalized(withFrench, 'FR')).toBe('Vrai');
    });

    it('falls back to Arabic while the language is only partly translated', () => {
      expect(resolveLocalized(labels, 'FR')).toBe('صحيح');
    });
  });

  describe('degradation', () => {
    it('falls back to the default locale when the requested one is absent', () => {
      expect(resolveLocalized({ ar: 'صحيح' }, 'EN')).toBe('صحيح');
      expect(DEFAULT_LOCALE).toBe('AR');
    });

    it('falls back to any present language when even the default is absent', () => {
      expect(resolveLocalized({ en: 'True' }, 'FR')).toBe('True');
    });

    it('falls back to the supplied key when the map is empty', () => {
      expect(resolveLocalized({}, 'EN', 'TRUE')).toBe('TRUE');
    });

    it('treats an empty string as absent rather than rendering blank', () => {
      expect(resolveLocalized({ ar: 'صحيح', en: '' }, 'EN')).toBe('صحيح');
    });

    it('never throws on null, undefined or a non-object', () => {
      expect(resolveLocalized(null, 'EN', 'X')).toBe('X');
      expect(resolveLocalized(undefined, 'EN', 'X')).toBe('X');
      expect(resolveLocalized('not a map', 'EN', 'X')).toBe('X');
    });
  });
});

describe('LOOKUP_REGISTRY', () => {
  it('gives every row a label in both currently active languages', () => {
    const gaps: string[] = [];
    for (const entry of LOOKUP_REGISTRY) {
      for (const row of entry.rows) {
        for (const locale of ['ar', 'en']) {
          if (!row.labels?.[locale])
            gaps.push(`${entry.label}.${row.code}:${locale}`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it('has no duplicate codes within a table', () => {
    for (const entry of LOOKUP_REGISTRY) {
      const codes = entry.rows.map((r) => r.code);
      expect(new Set(codes).size).toBe(codes.length);
    }
  });

  it('covers every lookup table the schema defines', () => {
    // A table added to the schema but forgotten here would never be seeded and
    // never be integrity-checked.
    expect(LOOKUP_REGISTRY.length).toBe(16);
  });
});
