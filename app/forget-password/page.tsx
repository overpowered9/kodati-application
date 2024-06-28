import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ForgetPassword from "../components/ResetPassword/ForgetPassword";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return redirect('/dashboard');
  }

  return (
    <ForgetPassword />
  );
};

export default Page;