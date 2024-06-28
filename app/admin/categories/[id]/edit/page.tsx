import EditCategory from '@/app/components/Categories/EditCategory';
import Header from '@/app/components/Header/Header';
import { getCategory } from '@/utils/category-helpers';
import { notFound } from 'next/navigation';

const EditCategoryPage = async ({ params }: { params: { id: string } }) => {
  const data = await getCategory({ id: Number(params.id) });
  if (!data) {
    return notFound();
  }
  return (
    <>
      <div>
        <Header />
      </div>
      <EditCategory category={data} />
    </>
  )
};

export default EditCategoryPage;