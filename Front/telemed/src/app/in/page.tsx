"use client";

import React, { useEffect, useState } from "react";
/* import data from "@/helpers/mockAppointments"; */
import Link from "next/link";
import { PATHROUTES } from "@/helpers/pathroutes";
import useGlobalStore from "@/store/globalStore";
import Profile from "@/components/profile/Profile";
import formatFecha from "@/helpers/formatFecha";
import getDiasRestantes from "@/helpers/getDiasRestantes";
import { Appointments } from "@/interfaces/interfaces";
import Image from "next/image";

const Page = () => {
  const { user } = useGlobalStore();

  const [section, setSection] = useState<"nextAppoitments" | "profile" | null>(
    "nextAppoitments"
  );

  const [allAppointments, setAllAppointments] = useState<Appointments[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointment/my_shifts/${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },

            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);

        setAllAppointments(Array.isArray(data) ? data : []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("Error fetching appointments");
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <p className="font-bold text-2xl">¡Hola, {user?.name}!</p>
      <div className=" w-full max-w-3xl flex justify-end">
        <Link href={PATHROUTES.APPOINTEMNT}>
          <button className="px-12 py-1 bg-acent w-[205px] h-[50px] shadow-sm shadow-slate-700 text-white rounded-full hover:bg-gray-400 transition">
            Reservar turno
          </button>
        </Link>
      </div>

      <div className="w-full  max-w-3xl">
        <div className="flex  justify-start items-end">
          <div
            className={`relative w-[180px] px-5  max-w-2xl flex justify-center rounded-t-lg border-b-0   text-gray-800 border border-celeste ${
              section === "nextAppoitments"
                ? "font-bold bg-celeste border-b-celeste z-20 py-2"
                : "bg-slate-200 py-1"
            }`}
          >
            <button onClick={() => setSection("nextAppoitments")}>
              Próximos turnos
            </button>
          </div>
          <div
            className={`relative ml-1 w-[180px] px-5  max-w-2xl flex justify-center rounded-t-lg   border-b-0 text-gray-800 border border-celeste ${
              section === "profile"
                ? "font-bold bg-celeste border-b-celeste z-20 py-2 "
                : "bg-slate-200 py-1"
            }`}
          >
            <button onClick={() => setSection("profile")}>Mis datos</button>
          </div>
        </div>

        {/* Contenedor con el borde alrededor de las cards */}
        <div className="relative w-full min-h-[422px] max-w-3xl border border-celeste bg-celeste z-0 px-12 py-6 space-y-5 shadow-xl rounded-t-none rounded-tr-xl rounded-br-xl rounded-bl-xl">
          {section === "nextAppoitments" && allAppointments.length === 0 && (
            <span className="flex flex-col items-center bg-white border shadow-xl rounded-md px-6 py-8 w-full">
              Solicite su turno para poder acceder a su agenda
            </span>
          )}
          {section === "nextAppoitments" &&
            allAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white border shadow-xl rounded-md p-6 w-full"
              >
                <div className="text-start space-y-3">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex">
                      <Image
                        src={"/calendario.svg"}
                        alt="calendario"
                        width={20}
                        height={20}
                      />
                      <p className="text-sm ml-2">
                        {formatFecha(appointment.fecha)} {appointment.hora} hrs
                      </p>
                    </div>
                    <p className="text-sm border bg-celeste text-textColor border-gray-400 px-3">
                      {getDiasRestantes(appointment.fecha)}
                    </p>
                  </div>

                  <div className="flex">
                    <Image
                      src={"/doctorIcon.svg"}
                      alt="doctorIcon"
                      height={20}
                      width={20}
                    />
                    <p className="text-sm ml-2 capitalize">
                      {appointment.doctor.nombreCompleto}
                    </p>
                  </div>

                  <div className="flex">
                    <Image
                      src={`${appointment.doctor.especialidad}.svg`}
                      alt={`${appointment.doctor.especialidad}`}
                      width={20}
                      height={20}
                    />
                    <p className="text-sm ml-2 capitalize">
                      {appointment.doctor.especialidad}
                    </p>
                  </div>

                  <div className="flex">
                    <Image
                      src={"/laptop.svg"}
                      alt="laptop"
                      height={20}
                      width={20}
                    />

                    <p className="text-sm ml-2">
                      Revise su correo, el enlace para su videollamada ha sido
                      enviado.
                    </p>
                  </div>
                </div>
                {/* <TermsAndConditions /> */}
              </div>
            ))}

          {section === "profile" && (
            <div className=" justify-center items-center ">
              {/* Contenido de la sección de perfil */}
              <Profile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
