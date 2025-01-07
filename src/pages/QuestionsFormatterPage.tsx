import React, { useState, useRef } from 'react';
// import { JSDOM } from 'jsdom';
import toast from 'react-hot-toast';

import { DefaultLayout } from '../layout/DefaultLayout';

import { defaultValue } from './defaultValue';

import * as cheerio from 'cheerio';

export const QuestionsFormatterPage = () => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const questions = extractQuestionsAndAlternatives(value);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleCopy = (question: number) => {
    if (inputRef.current) {
      toast.success('Copied to clipboard');
      // inputRef.current.select();

      const questionText = [questions[question].question, ...questions[question].alternatives].join(
        '\n'
      );
      navigator.clipboard.writeText(questionText);
    }
  };

  return (
    <DefaultLayout title="Text Formatters">
      <div className="flex space-x-3">
        <div className="w-6/12">
          <Textarea value={value} onChange={handleChange} inputRef={inputRef}></Textarea>
        </div>
        <div className="w-6/12">
          <Output questions={questions} handleCopy={handleCopy}></Output>
        </div>
      </div>
    </DefaultLayout>
  );
};

const Output = ({
  questions,
  handleCopy,
}: {
  questions: QuestionResult[];
  handleCopy: (questionIndex: number) => void;
}) => {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Questões</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-5">
            <h3 className="text-lg font-medium">Questão {index + 1}</h3>
            <button
              type="button"
              onClick={() => handleCopy(index)}
              className="text-blue-500 underline hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline"
            >
              copy to clipboard
            </button>
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 rounded p-3 whitespace-pre-line">{question.question}</div>
              {question.alternatives.map((alternative, index) => (
                <div key={index} className="bg-gray-200 rounded p-3">
                  {alternative}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Textarea = ({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={onChange}
      className="w-full p-5 border rounded mb-5"
      rows={5}
      cols={100}
    />
  );
};

interface QuestionResult {
  question: string;
  alternatives: string[];
}

export const extractQuestionsAndAlternatives = (html: string): QuestionResult[] => {
  const $ = cheerio.load(html);
  const results: QuestionResult[] = [];

  // const questionText = $('[data-testid="question-typography"]').text().trim();

  // // Seleciona todas as questões dinamicamente
  $('[data-testid^="question-"]')
    .not('[data-testid^="alternative-"]')
    .each((_, questionElement) => {
      // selecione the first question typografiy
      const questionText = $(questionElement)
        .find('[data-testid="question-typography"]')
        .first()
        .text()
        .trim();
      // const questionText = $(questionElement)
      //   .find('[data-testid="question-typography"]')
      //   .not('[data-testid^="alternative-"]')

      //   .text()
      //   .trim();

      //     const questionText = $(questionElement)
      //       .find('[data-testid="question-typography"]')
      //       .text()
      //       .trim();

      // Remove espaços e linhas duplicadas na questão
      const questionWithoutJustSpaces = questionText.replace(/[ ]{2,}/g, ' ');
      const removedDuplicatedEmptyLines = questionWithoutJustSpaces.replace(/\n \n /g, '\n');

      // Seleciona as alternativas para a questão atual
      const alternatives: string[] = [];
      $(questionElement)
        .find('[data-testid^="alternative-"]')
        .each((index, element) => {
          const alternativeText = $(element)
            .find('[data-testid="question-typography"]')
            .text()
            .trim();
          // Remove espaços e linhas duplicadas na alternativa
          const alternativeWithoutJustSpaces = alternativeText.replace(/[ ]{2,}/g, ' ');
          const formattedAlternative = alternativeWithoutJustSpaces.replace(/\n \n /g, '\n');

          const letter = String.fromCharCode(97 + index); // 'a', 'b', 'c', ...
          if (formattedAlternative) {
            alternatives.push(`${letter}) ${formattedAlternative}`);
          }
        });

      if (alternatives.length && removedDuplicatedEmptyLines.length) {
        results.push({
          question: removedDuplicatedEmptyLines,
          alternatives,
        });
      }
    });

  return results;
};
