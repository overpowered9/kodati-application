import { searchParams } from "@/types/search-params";
import { notFound, redirect } from "next/navigation";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth-options";

const Page = async ({ searchParams }: { searchParams: searchParams }) => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return redirect('/dashboard');
  }
  const token = typeof searchParams.token === "string" ? searchParams.token : undefined;
  if (!token) return notFound();

  return (
    <ResetPassword token={token} />
  );
};

export default Page;