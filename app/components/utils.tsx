export const highlightMatch = (text: string, search: string | undefined): React.ReactNode => {
  if (!search || !text) return text.length === 0 ? '-' : text;

  const regex = new RegExp(`(${search})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => (
    regex.test(part) ? <span key={index} className=" bg-yellow-500">{part}</span> : part
  ));
};

export const getStatusColor = {
  processing: 'bg-[#6BAAFC]',
  approved: 'bg-purple-500',
  shipped: 'bg-yellow-500',
  fulfilled: 'bg-[#039855]',
  failed: 'bg-[#D92D20]',
};