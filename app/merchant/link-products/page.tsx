import ProductsList from "@/app/components/LinkProducts/Merchant/ProductsList";
import Header from "@/app/components/Header/Header";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utils/auth-options";
import { User } from "@/database/models";
import { v4 as uuid } from 'uuid';
import Await from '@/app/components/Await';
import Skeleton from '@/app/components/Skeleton';
import { Suspense } from 'react';
import ServerError from "@/app/components/ServerError";
import { searchParams } from "@/types/search-params";
import { createStoreService } from "@/services/StoreService";
import { filterProductsByMerchantLinking } from "@/utils/product-helpers";
import { ProductsRequest, ZidProductsRequest } from "@/types";

const LinkProducts = async ({ searchParams }: { searchParams: searchParams }) => {
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const provider_page = typeof searchParams.provider_page === "string" ? Number(searchParams.provider_page) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const linked = typeof searchParams.linked === "string" ? (searchParams.linked.toLowerCase() === "true" ? true : searchParams.linked.toLowerCase() === "false" ? false : undefined) : true;
  let providerProducts: any;
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  const merchantId = user?.id;
  try {
    let request: ProductsRequest | ZidProductsRequest = { page: provider_page, keyword: search };
    if (user.provider === 'zid') {
      if (!user?.metadata?.store_id || typeof user?.metadata?.store_id !== 'number') throw new Error('Zid store ID not found');
      request = { ...request, 'Store-Id': user?.metadata?.store_id };
    }
    const service = createStoreService(user?.provider, user.access_token);
    providerProducts = await service.fetchProducts(request);
  } catch (error: any) {
    console.error('Error:', error);
    return <ServerError />;
  }
  const products = filterProductsByMerchantLinking({ user_id: merchantId, linked, page });

  return (
    <section key={uuid()}>
      <div>
        <Header />
      </div>
      <Suspense fallback={<Skeleton />}>
        <Await promise={products}>
          {(products) => <ProductsList localProducts={products} providerProducts={providerProducts} provider={user.provider} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default LinkProducts;