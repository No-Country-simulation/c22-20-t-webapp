import React from "react";
import People from "./People";

const OurTeam = () => {
  return (
    <div className="hidden md:block w-full bg-[#7c4bd8]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8 ml-24">
          Nuestro Equipo:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <People
              rol="UX/UI"
              name="Magalí Silva"
              name2="Maria Paz"
              photo="magalis"
              photo2="maria"
            />
          </div>
          <div className="flex flex-col items-center">
            <People
              rol="Backend"
              name="Dmitri Jrapach"
              name2="Agustin Ibarra"
              photo="dmitri"
              photo2="agus"
            />
          </div>
          <div className="flex flex-col items-center">
            <People
              rol="Frontend"
              name="Felipe Hernández"
              name2="José Garces"
              photo="felipe"
              photo2="jose"
            />
          </div>
          <div className="flex flex-col items-center">
            <People
              rol="QA Tester Manual"
              name="Cynthia Mariel"
              name2="Erika Escalante"
              photo="cynthia"
              photo2="erika"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
