import React from "react";

/**
 * WordCard: shows single dictionary API entry with phonetics and meanings
 * props.entry has shape from dictionaryapi.dev
 */
export default function WordCard({ entry }) {
  const { word, phonetics = [], meanings = [] } = entry || {};

  return (
    <article className="word-card" aria-labelledby={`word-${word}`}>
      <header>
        <h2 id={`word-${word}`} className="word-title">{word}</h2>

        {/* Phonetics: show text + an audio control per available audio */}
        {phonetics.length > 0 && (
          <div className="phonetics" aria-label="Pronunciations">
            {phonetics.map((p, i) => (
              <div key={i} className="phonetic-row">
                {p.text && <div className="phonetic-text">{p.text}</div>}
                {p.audio && (
                  <div className="audio-wrap">
                    <audio controls preload="none" src={p.audio}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="meanings">
        {meanings.map((m, mi) => (
          <section key={mi} className="meaning" aria-labelledby={`meaning-${word}-${mi}`}>
            <div id={`meaning-${word}-${mi}`} className="part">{m.partOfSpeech}</div>
            <ul>
              {m.definitions.map((d, di) => (
                <li key={di} className="definition">
                  <div>{d.definition}</div>
                  {d.example && <div className="example">“{d.example}”</div>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
