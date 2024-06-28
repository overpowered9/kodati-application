import Header from '@/app/components/Header/Header';
import EditRegion from '@/app/components/Regions/EditRegion';
import { getRegion } from '@/utils/region-helpers';
import { notFound } from 'next/navigation';

const EditRegionPage = async ({ params }: { params: { id: string } }) => {
  const data = await getRegion({ id: Number(params.id) });
  if (!data) {
    return notFound();
  }
  return (
    <>
      <div>
        <Header />
      </div>
      <EditRegion region={data} />
    </>
  )
};

export default EditRegionPage;