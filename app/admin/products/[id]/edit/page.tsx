import EditProduct from '@/app/components/EditProduct';
import { getCategories } from '@/utils/category-helpers';
import { getProduct } from '@/utils/product-helpers';
import { getRegions } from '@/utils/region-helpers';
import { notFound } from 'next/navigation';

const EditProductPage = async ({ params }: { params: { id: string } }) => {
    const data = await getProduct({ id: Number(params.id) });
    if(!data) {
        return notFound();
    }
    const categories = await getCategories(false);
    const regions = await getRegions();
    return <EditProduct productData={data} categories={categories} regions={regions} />
};

export default EditProductPage;