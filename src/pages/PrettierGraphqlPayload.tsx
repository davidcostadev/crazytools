import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import * as prettier from 'prettier';
import toast from 'react-hot-toast';
import parserGraphql from 'prettier/plugins/graphql';

import { DefaultLayout } from '../layout/DefaultLayout';

Prism.highlightAll();

export const PrettierGraphqlPayload = () => {
  const [input, setInput] = React.useState(parse('init'));

  const handleTextareaChange = async ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { query, variables } = parse(value);

    setInput({
      query: await prettierFormatter(formatQuery(query), 'graphql'),
      variables: JSON.stringify(variables, null, 2),
    });
  };

  const handleCopyToClipboard = (type: 'query' | 'variables') => () => {
    const el = document.createElement('textarea');
    el.value = input[type];
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(el.value);
    document.body.removeChild(el);
    toast.success('Copied to clipboard');
  };

  return (
    <DefaultLayout title="Prettier Graphql Payload">
      <textarea
        onChange={handleTextareaChange}
        className="w-full p-5 border rounded mb-5"
        rows={5}
        cols={100}
      />
      {(input.query || input.variables) && (
        <div className="flex space-x-5">
          <div className="flex-wrap basis-1/2 flex flex-col ">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Variables</h3>
              <button
                onClick={handleCopyToClipboard('variables')}
                className="text-blue-500 underline hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline"
              >
                copy to clipboard
              </button>
            </div>
            <pre
              className="language-json rounded flex-grow bg-red-500"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(input.variables, Prism.languages.javascript, 'json'),
              }}
            />
          </div>
          <div className="flex-wrap   basis-1/2 flex flex-col">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Query</h3>
              <button
                onClick={handleCopyToClipboard('query')}
                className="text-blue-500 underline hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline"
              >
                copy to clipboard
              </button>
            </div>

            <pre
              className="language-graphql rounded flex-grow"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(input.query, Prism.languages.javascript, 'graphql'),
              }}
            />
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

const parse = (value: string) => {
  try {
    const { variables, query } = JSON.parse(
      value
        .trim()
        .replace(/__typename/g, ' ')
        .replace(/\n/g, '\\n')
    );
    return { variables, query };
  } catch (error) {
    // console.error(error);
    return { variables: '', query: '' };
  }
};

const formatQuery = (queryString: string) => {
  return queryString.replace(/\\/g, '\\');
};

const prettierFormatter = (code: string, parser = 'babel') =>
  prettier.format(code, { semi: false, parser, plugins: [parserGraphql] });

// const init =
//   '{"operationName":null,"variables":{"input":{"accountId":"5cd25cd7-fb27-4abf-a4d5-aa4258db327b","papaId":"d5c2f48b-4b39-44f0-8997-4edb50a6f071","nickname":1,"address2":"asdasd","note":"asdasdasd","address":"Abo Simbel Desert, Aswan Governorate 81514, Egypt","lat":"23.6966498","lng":"32.7181375","state":"Aswan Governorate","countryIso":"EG","zipcode":"81514"}},"query":"mutation ($input: LocationInput!) {\n createLocation(input: $input) {\n data {\n ...LocationParts\n account {\n data {\n id\n fullName\n }\n }\n }\n }\n}\n\nfragment LocationParts on Location {\n id\n nickname\n address\n address2\n streetName\n houseNumber\n city\n state\n zipcode\n lat\n lng\n note\n description\n timezone\n insertedAt\n deletedAt\n}\n"}';
