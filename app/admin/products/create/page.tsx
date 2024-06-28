import CreateProduct from '@/app/components/CreateProduct';
import { getCategories } from '@/utils/category-helpers';
import { getRegions } from '@/utils/region-helpers';

export const dynamic = 'force-dynamic';

const CreateProductPage = async () => {
  const categories = await getCategories(false);
  const regions = await getRegions();
  return <CreateProduct categories={categories} regions={regions} />
};

export default CreateProductPage;