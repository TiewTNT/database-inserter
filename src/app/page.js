"use client";

import { createClient } from "@/utils/supabase/client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Home() {
  const supabase = createClient();
  const [inserts, setInserts] = useState();
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const handleInserts = async (payload) => {
    const { data: inserts2 } = await supabase
      .from("texts")
      .select()
      .order("id", { ascending: false });
    if (inserts2.at(0).image) {
        await delay(2000);
    }
    fetchData();
  };
  supabase
    .channel("texts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "texts" },
      handleInserts
    )
    .subscribe();
    
  async function fetchData() {
    const { data: inserts2 } = await supabase
      .from("texts")
      .select()
      .order("id", { ascending: false });

    setInserts(inserts2);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Link
        href="/add"
        className="btn dark: dark:bg-green-800 dark:hover:bg-green-700 dark:text-[#eaeaea] bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg"
      >
        Submit your own message
      </Link>
      <ol>
        {inserts?.map((insert) =>
          insert.image ? (
            insert.text.trim() ? (
              <li className="m-3">
                <div class="w-[100%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    alt={
                      supabase.storage
                        .from("images")
                        .getPublicUrl(insert.id.toString() + "." + insert.image_file_type).data
                        .publicUrl
                    }
                    src={
                      supabase.storage
                        .from("images")
                        .getPublicUrl(insert.id.toString() + "." + insert.image_file_type).data
                        .publicUrl
                    }

                    className="rounded-lg mx-auto w-[40%]"
                  />

                  <div class="dark:bg-lime-800 dark:text-[#eaeaea] bg-lime-600 p-4 text-white lg:p-5">
                    <p class="text-base font-semibold text-lg lg:text-2xl">
                      {insert.text.split("\n").map((line, index) => (
                        <React.Fragment key={insert.id}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </li>
            ) : (
              <li>
                <img
                  alt={
                    supabase.storage
                      .from("images")
                      .getPublicUrl(insert.id.toString() + "." + insert.image_file_type).data
                      .publicUrl
                  }
                  src={
                    supabase.storage
                      .from("images")
                      .getPublicUrl(insert.id.toString() + "." + insert.image_file_type).data
                      .publicUrl
                  }
                  className="rounded-lg mx-auto m-3 w-[40%]"
                />
              </li>
            )
          ) : (
            <li
              key={insert.id}
              className="dark:bg-lime-800 dark:text-[#eaeaea] bg-lime-600 p-4 m-3 rounded-md text-white font-semibold text-lg lg:text-2xl lg:p-5"
            >
              {insert.text.split("\n").map((line, index) => (
                <React.Fragment key={insert.id}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </li>
          )
        )}
      </ol>
    </>
  );
}