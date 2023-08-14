import path, { resolve } from "path";
import fs, { createWriteStream, mkdir, unlink } from "fs";
import { finished } from "stream";

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
        console.log(error);
      });
    });

    readStream.pipe(writeStream);

    return filePath.replace("\\", "/");
  } catch (error) {
    console.log(error);
  }
};

// userId / profile / photo;
// userId / posts / idPost / photo;
