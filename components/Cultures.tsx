import Head from "next/head";

const cultures = [
  {
    name: "Nepali",
    description:
      "Nepali culture is a combination of various ethnic groups and religions. The country has a unique blend of Hindu and Buddhist traditions, which is reflected in its art, music, and dance.",
    color: "bg-yellow-400",
  },
  {
    name: "Hindi",
    description:
      "Hindi culture is deeply rooted in ancient Indian history and traditions. It is known for its colorful festivals, intricate textiles, and spicy cuisine. Hindi cinema, or Bollywood, is one of the most popular forms of entertainment in India.",
    color: "bg-green-400",
  },
  {
    name: "Gujarati",
    description:
      "Gujarati culture is known for its vibrant arts and crafts, including colorful clothing and intricate embroidery. It is also known for its rich history of literature and poetry, as well as its delicious vegetarian cuisine.",
    color: "bg-red-400",
  },
];

const Cultures: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Cultures of Nepali, Hindi and Gujarati Languages</title>
        <meta
          name="description"
          content="Learn about the cultures of Nepali, Hindi and Gujarati languages"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-900 min-h-screen py-12 px-4 flex justify-center items-center">
        <div className="container">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            Cultures of Nepali, Hindi and Gujarati Languages
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cultures.map((culture) => (
              <div
                key={culture.name}
                className={`${culture.color} rounded-lg p-6 text-white`}
              >
                <h2 className="text-2xl font-semibold mb-4">{culture.name}</h2>
                <p className="text-lg">{culture.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cultures;
