const tryCatch = async <T>(
  callback: () => Promise<T>,
  defaultValue?: T
): Promise<T | undefined> => {
  try {
    return await callback();
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
};

export default tryCatch;
