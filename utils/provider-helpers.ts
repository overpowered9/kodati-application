import { Provider } from "@/database/models";

export const getAllProviders = async () => {
  try {
    const providers = await Provider.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at'],
      }
    });
    const serialize = JSON.stringify(providers);
    const deserialize = JSON.parse(serialize) as Provider[];
    return deserialize;
  } catch (error) {
    console.error(error);
    return null;
  }
}
