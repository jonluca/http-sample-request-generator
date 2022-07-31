import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import type { IResult } from "../utils/generate-requests";
import generateRequests from "../utils/generate-requests";
import { useState } from "react";

// Should this app be React? no! is it the fastest way to get something useful out the door? yes!
const Home: NextPage = () => {
  const [full, setFull] = useState(false);
  const [auth, setAuth] = useState(false);
  const [results, setResults] = useState<IResult[]>([]);
  const addResult = (result: any) => {
    setResults((old) => {
      return [...old, result];
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>HTTP Request Generator</title>
        <meta name="description" content="https://github.com/jonluca/http-sample-request-generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">HTTP Request Generator</a>
        </h1>
        <p className={styles.description}>
          Clicking start below will generate all forms of HTTP requests from this page to its server for testing
          purposes.
        </p>
        <span>
          <input name={"full"} id={"full"} type={"checkbox"} checked={full} onChange={() => setFull((v) => !v)} />
          <label htmlFor={"full"}>Full suite (All status codes)</label>
        </span>
        <span>
          <input name={"auth"} id={"auth"} type={"checkbox"} checked={auth} onChange={() => setAuth((v) => !v)} />
          <label htmlFor={"auth"}>Auth suite (Set cookie and custom headers)</label>
        </span>
        <div className={styles.grid}>
          <button
            onClick={() => {
              setResults([]);
              return generateRequests({ full, auth, addResult });
            }}
            className={styles.card}
          >
            <h2>Start &rarr;</h2>
          </button>
          <div className={styles.resultContainer}>
            {results.length > 0 &&
              results.map((result) => (
                <div key={result.id} className={styles.result}>
                  <span className={result.status > 300 ? styles.statusFail : styles.statusSuccess}>
                    {result.status}
                  </span>
                  <span className={styles.path}>{result.path}</span>
                </div>
              ))}
          </div>
        </div>
        <footer className={styles.footer}>
          <a href="https://github.com/jonluca/http-sample-request-generator" target="_blank" rel="noreferrer">
            Source code on GitHub
          </a>
        </footer>
      </main>
    </div>
  );
};

export default Home;
