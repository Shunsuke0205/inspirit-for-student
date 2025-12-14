import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = async () => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const isLoggedIn = !userError && (userData?.user !== null);

  if (userError) {
    console.error("Error fetching user data:", userError.message);
  } else {
    const { error: rpcError } = await supabase.rpc(
      'update_last_login_if_needed',
      { user_id_in: userData.user.id }
    );

    if (rpcError) {
      console.error("Failed to update last login via RPC:", rpcError);
    }
  }

  return (
    <header className="py-4 border-b border-gray-300 flex justify-between items-center ">
      <Link
        href="/"
        className="flex items-center"
      >
        <Image
          src="/product_icon.png"
          alt="Icon"
          width={50}
          height={50}
          className=""
        />
        <h1 className="ml-4 text-xl lg:text-2xl">高校生クラファン</h1>
      </Link>
      {isLoggedIn ?
        <div>
          <Link
            href={`/profile/${userData.user.id}`}
            className="border border-gray-300 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-100"
          >
            マイページ
          </Link>
        </div>
        :
        <div>
          <Link
            href="/login"
            className="border border-gray-300 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-200"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="border border-gray-300 ml-4 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-200"
          >
            新規登録
          </Link>
        </div>
      }
    </header>
  );
};

export default Header;
