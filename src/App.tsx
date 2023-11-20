import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import * as prettier from 'prettier';

import parserGraphql from 'prettier/plugins/graphql';

Prism.highlightAll();

const App = () => {
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

  return (
    <>
      <textarea onChange={handleTextareaChange} rows={10} cols={100} />
      <div>
        <h3>Variables</h3>
        <pre
          className="language-json"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(input.variables, Prism.languages.javascript, 'json'),
          }}
        />

        <h3>Query</h3>
        <pre
          className="language-graphql"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(input.query, Prism.languages.javascript, 'graphql'),
          }}
        />
      </div>
    </>
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
    return { variables: '{}', query: '' };
  }
};

const formatQuery = (queryString: string) => {
  return queryString.replace(/\\/g, '\\');
};

const prettierFormatter = (code: string, parser = 'babel') =>
  prettier.format(code, { semi: false, parser, plugins: [parserGraphql] });

// const init =
//   '{"operationName":null,"variables":{"input":{"accountId":"5cd25cd7-fb27-4abf-a4d5-aa4258db327b","papaId":"d5c2f48b-4b39-44f0-8997-4edb50a6f071","nickname":1,"address2":"asdasd","note":"asdasdasd","address":"Abo Simbel Desert, Aswan Governorate 81514, Egypt","lat":"23.6966498","lng":"32.7181375","state":"Aswan Governorate","countryIso":"EG","zipcode":"81514"}},"query":"mutation ($input: LocationInput!) {\n createLocation(input: $input) {\n data {\n ...LocationParts\n account {\n data {\n id\n fullName\n }\n }\n }\n }\n}\n\nfragment LocationParts on Location {\n id\n nickname\n address\n address2\n streetName\n houseNumber\n city\n state\n zipcode\n lat\n lng\n note\n description\n timezone\n insertedAt\n deletedAt\n}\n"}';

export default App;
