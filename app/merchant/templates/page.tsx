import Header from "@/app/components/Header/Header";
import Template from "@/app/components/Template";
import { EmailTemplate, User } from "@/database/models";
import { authOptions } from "@/utils/auth-options";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const authenticatedUser = session?.user as User;
  const user = await User.findByPk(authenticatedUser.id, {
    attributes: ['id'],
    include: {
      model: EmailTemplate,
      attributes: ['subject', 'body'],
      required: false,
    }
  });

  return (
    <>
      <div>
        <Header />
      </div>
      <div>
        <Template template={user?.EmailTemplate?.toJSON()} />
      </div>
    </>
  );
};

export default Page;