import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { WritingStyle } from "../components/DropDown";
import DropDownReaderAge, { ReaderAgeType } from "../components/DropDownReaderAge";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [style, setStyle] = useState<WritingStyle>("Bedtime Story");
  const [age, setAge] = useState<ReaderAgeType>("Baby");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  console.log("Streamed response: ", generatedBios);

  const prompt =
      `Topic: A Story
      Theme: ${bio}
      Writing Style: ${style}
      Reading age: ${age}
      Include: Dialog between characters
      Write 3 paragraphs, and important to end each paragraph with "|"`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Story Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
       
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900 text-left">
          Story Playground
        </h1>
        
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              1. Write a story prompt{" "}
              <span className="text-slate-500">
                (it can be about anything)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Explain photosynthesis for a 5 year old."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <p className="text-left font-medium">2. Select your writing style.</p>
          </div>
          <div className="block">
            <DropDown style={style} setStyle={(newStyle) => setStyle(newStyle)} />
          </div>

          <div className="flex mb-5 items-center space-x-3 sm:mt-10 mt-8">
            <p className="text-left font-medium">3. Select your reading age</p>
          </div>
          <div className="block">
            <DropDownReaderAge age={age} setAge={(newAge) => setAge(newAge)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your story &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your story
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      .substring(generatedBios.indexOf("1"))
                      .split("|")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Story copied to clipboard", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                            <p>{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
