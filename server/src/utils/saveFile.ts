import path, { resolve } from "path";
import fs, { createWriteStream, unlink } from "fs";

export const saveFile = async (file: any, userPath: string) => {
  try {
    const { createReadStream, filename, mimetype } = await file;

    const bucketFolderPath = `public/${userPath}`;
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      throw new Error(
        "Invalid file format. Only PNG and JPG images are supported."
      );
    }

    if (!fs.existsSync(bucketFolderPath)) {
      fs.mkdirSync(bucketFolderPath, { recursive: true });
    }

    const filePath = path.join(bucketFolderPath, filename);

    const readStream = createReadStream();
    const writeStream = createWriteStream(filePath);

    writeStream.on("finish", resolve);

    writeStream.on("error", (error) => {
      unlink(filePath, () => {
        throw new Error("Could not upload file. Please try again later.");
      });
    });

    readStream.pipe(writeStream);

    return filePath.replace(/\\/g, "/");
  } catch (error) {
    throw new Error("Could not upload file. Please try again later.");
  }
};
