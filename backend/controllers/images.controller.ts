import * as model from "../models/images.model";

export async function getImages(req: any, res: any) {
  const images = await model.getImages();
  res.json(images);
}
