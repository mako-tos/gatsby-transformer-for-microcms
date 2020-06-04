const { onPreBootstrap } = require('../onPreBootstrap');

const reporter = {
  panic: jest.fn(),
}

beforeEach(() => {
  reporter.panic.mockClear();
});

describe('onPreBootstrap', () => {
  test('pass all', async () => {
    const pluginOptions = {
      mediaType: 'blog', // string
      field: 'headImage', // string
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });

  test('lack of mediaType', async () => {
    const pluginOptions = {
      field: 'headImage', // string
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('mediaType is not string', async () => {
    const pluginOptions = {
      mediaType: 1,
      field: 'headImage', // string
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('lack of field', async () => {
    const pluginOptions = {
      mediaType: 'MicrocmsBlog',
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('field is not string', async () => {
    const pluginOptions = {
      mediaType: 'MicrocmsBlog',
      field: {},
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('lack of useHljs', async () => {
    const pluginOptions = {
      mediaType: 'MicrocmsBlog',
      field: 'hero',
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });

  test('useHljs is not boolean', async () => {
    const pluginOptions = {
      mediaType: 'MicrocmsBlog',
      field: 'hero',
      useHljs: 1, // boolean
      image: {
        sizes: '800px', // string
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('lack of image.sizes', async () => {
    const pluginOptions = {
      mediaType: 'MicrocmsBlog',
      field: 'hero',
      useHljs: true, // boolean
      image: {
        loading: 'lazy', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });

  test('image.sizes is not string', async () => {
    const pluginOptions = {
      mediaType: 'blog',
      field: 'headImage',
      useHljs: true,
      image: {
        sizes: true,
        loading: 'lazy',
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });
  
  test('lack of image.loading', async () => {
    const pluginOptions = {
      mediaType: 'blog', // string
      field: 'headImage', // string
      useHljs: true, // boolean
      image: {
        sizes: '800px', // string
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });

  test('image.loading is not string', async () => {
    const pluginOptions = {
      mediaType: 'blog',
      field: 'headImage',
      useHljs: true,
      image: {
        sizes: '800px',
        loading: () => {},
      }
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('lack of image', async () => {
    const pluginOptions = {
      mediaType: 'blog',
      field: 'headImage',
      useHljs: true,
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });

  test('image is not object', async () => {
    const pluginOptions = {
      mediaType: 'blog',
      field: 'headImage',
      useHljs: true,
      image: 100,
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('option is not defined', async () => {
    const pluginOptions = undefined;
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(1);
  });

  test('minimum options', async () => {
    const pluginOptions = {
      mediaType: 'blog',
      field: 'headImage',
    };
    await onPreBootstrap(
      {
        reporter,
      },
      pluginOptions
    );
    expect(reporter.panic.mock.calls.length).toBe(0);
  });
});

