"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";

export default function Form() {
  const [inputValue, setInputValue] = useState("");
  const supabase = createClient();
  const [inserts, setInserts] = useState();
  const [inputImage, setInputImage] = useState();

  const handleInserts = (payload) => {
    setInserts(null);
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

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function fetchData() {
    const { data: inserts2 } = await supabase
      .from("texts")
      .select()
      .order("id", { ascending: true });
    if (inserts2.at(-1).image) {
      await delay(1000);
    }
    setInserts(inserts2);
  }
  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      (inputValue.replace(/^\s+|\s+$/g, "") && inputValue.length <= 150) ||
      inputImage
    ) {
      const supabase = createClient();

      const rowData = inputImage
        ? await supabase
            .from("texts")
            .insert({ text: inputValue.trim(), image: true })
            .select()
        : await supabase
            .from("texts")
            .insert({ text: inputValue.trim() })
            .select();

      const response = await supabase
        .from("texts")
        .delete()
        .order("id", { ascending: true })
        .limit(1)
        .select();
      const { data, error } = await supabase.storage
        .from("images")
        .remove([response.data[0].id.toString() + ".png"]);

      console.log(rowData);
      const currentId = rowData.data[0].id.toString();
      console.log(rowData);
      if (inputImage) {
        console.log(inputImage);
        const { data, error } = await supabase.storage
          .from("images")
          .upload(currentId + ".png", inputImage, {
            cacheControl: "3600",
            upsert: false,
          });
      }
      console.log(response);
    }
    if (inputValue.length > 150) {
      alert("Length exceeded limit (max 150 chars)");
    }
  }
  return (
    <>
      <form>
        <textarea
          aria-label="text input"
          className="dark:bg-green-900 dark:text-[#eaeaea] p-2 mt-5 flex justify-center items-center mx-auto my-auto block h-64 w-64 rounded-md"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        ></textarea>
        <input
          type="file"
          onChange={(event) => {
            setInputImage(event.target.files[0]);
          }}
        />
        <button
          aria-label="submit"
          onClick={handleSubmit}
          className="dark:bg-lime-700 dark:text-[#eaeaea] p-3 mt-3 flex justify-center items-center mx-auto my-auto block h-32 w-32 rounded-full text-2xl bg-lime-500 active:bg-lime-600 text-white font-bold"
        >
          Submit
        </button>
      </form>
      <a
        href="../"
        className="dark: dark:bg-green-800 dark:hover:bg-green-700 dark:text-[#eaeaea] bg-green-600 hover:bg-green-500 p-3 m-4 flex justify-center rounded-lg text-white text-lg "
      >
        See submissions
      </a>

      <React.Fragment className="dark:bg-lime-800 dark:text-[#eaeaea] bg-lime-600 p-4 m-3 rounded-md text-white font-semibold text-lg">
        {inserts?.at(-1).image ? (
          inserts?.at(-1).text.trim() ? (
            <div className="m-3">
              <div class="w-[100%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  alt={
                    supabase.storage
                      .from("images")
                      .getPublicUrl(inserts.at(-1).id.toString() + ".png").data
                      .publicUrl
                  }
                  src={
                    supabase.storage
                      .from("images")
                      .getPublicUrl(inserts.at(-1).id.toString() + ".png").data
                      .publicUrl
                  }
                  width="40%"
                  className="rounded-lg mx-auto"
                />

                <div class="dark:bg-lime-800 dark:text-[#eaeaea] bg-lime-600 p-4 text-white lg:p-5">
                  <p class="text-base font-semibold text-lg lg:text-2xl">
                    {inserts
                      ?.at(-1)
                      .text.split("\n")
                      .map((line, index) => (
                        <React.Fragment key={inserts?.at(-1).id}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <img
              alt={
                supabase.storage
                  .from("images")
                  .getPublicUrl(inserts.at(-1).id.toString() + ".png").data
                  .publicUrl
              }
              src={
                supabase.storage
                  .from("images")
                  .getPublicUrl(inserts.at(-1).id.toString() + ".png").data
                  .publicUrl
              }
              width="40%"
              className="rounded-lg mx-auto"
            />
          )
        ) : (
          <p
            key={inserts?.at(-1).id}
            className="dark:bg-lime-800 dark:text-[#eaeaea] bg-lime-600 p-4 m-3 rounded-md text-white font-semibold text-lg lg:text-2xl lg:p-5"
          >
            {inserts
              ?.at(-1)
              .text.split("\n")
              .map((line, index) => (
                <React.Fragment key={inserts?.at(-1).id}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </p>
        )}
      </React.Fragment>
    </>
  );
}
