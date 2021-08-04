import Header from "../components/Header";

const returns = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <main className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10">
          <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
            Your Returns
          </h1>
        </div>
      </main>
    </div>
  );
};

export default returns;
