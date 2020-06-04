const validateOptions = ({ reporter }, options) => {
  if (!options) {
    reporter.panic("need options");
    return;
  }

  if (!options.mediaType || typeof options.mediaType !== "string") {
    reporter.panic("need mediaType and must be string");
    return;
  }

  if (!options.field || typeof options.field !== "string") {
    reporter.panic("need field and must be string");
    return;
  }

  if (options.useHljs && typeof options.useHljs !== "boolean") {
    reporter.panic("useHljs must be boolean");
    return;
  }

  if (options.image && typeof options.image !== "object") {
    reporter.panic("image must be object");
    return;
  }

  if (options.image && options.image.sizes && typeof options.image.sizes !== "string") {
    reporter.panic("image.sizes must be string");
    return;
  }

  if (options.image && options.image.loading && typeof options.image.loading !== "string") {
    reporter.panic("image.sizes must be loading");
    return;
  }
};
exports.onPreBootstrap = validateOptions;
