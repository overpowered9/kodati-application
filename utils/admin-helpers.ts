import { AdminLinkedProduct, Provider } from "@/database/models";
import { createProviderService } from "@/services/ProviderService";

export const fetchAndUpdatePrices = async (provider: Provider): Promise<void> => {
  const providerService = await createProviderService(provider);
  const providerProducts = await providerService.fetchProducts();
  const updatePromises: Promise<AdminLinkedProduct>[] = [];

  for (const linkedProduct of provider?.AdminLinkedProducts) {
    const providerProduct = providerProducts?.results?.find((p: any) => p?.sku === linkedProduct?.provider_product_id);

    if (providerProduct) {
      updatePromises.push(linkedProduct.update({ min_price: providerProduct?.min_price }));
    }
  }
  await Promise.all(updatePromises);
}