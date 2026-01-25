"use client"

import { logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

const LogoutButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.log("Error fetching user:", error);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn) {
    return (
      <div>
        <button
          onClick={logout}
          className="mt-3 px-3 py-1 bg-white cursor-pointer rounded-lg hover:bg-gray-200 border border-gray-300"
        >
          ログアウトする
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default LogoutButton;
