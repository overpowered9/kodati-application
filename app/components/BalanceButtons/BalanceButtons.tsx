import Image from "next/image";
import buttons from "./buttons.module.css";
import whatsapp from "@/public/credit/logoswhatsappicon.svg";
import Search from "../Search";
import Link from "next/link";

const BalanceButtons = ({ currentBalance, search, name }: { currentBalance: number | null | undefined; search?: string, name: string | null }) => {
  const contactLink = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` : null;

  return (
    <div className={buttons.hello_storeowner1_parent}>
      <b className={buttons.hello_storeowner1}>Hello, {name}</b>
      <div className={buttons.total_balance_parent}>
        <h2 className={buttons.total_balance} id="TotalBalance">
          Total Balance
        </h2>
        <h1 className={buttons.h1} id="Balance">
          ${currentBalance ?? 0}
        </h1>
      </div>
      <div className={buttons.buttons_newparent}>
        {contactLink && (
          <Link href={contactLink} target="_blank">
            <button className={buttons.background_parent} id="Whatsapp">
              <div className={buttons.buttonbasetext_md_group}>
                <div className={buttons.buttonbasetext_md1}>
                  <div className={buttons.text1}>Whatsapp</div>
                </div>
                <Image className={buttons.logoswhatsapp_icon} alt="Whatsapp" src={whatsapp} />
              </div>
            </button>
          </Link>
        )}
        <div className={buttons.Searchbutton}>
          <Search search={search} />
        </div>
      </div>
    </div>
  );
};

export default BalanceButtons;