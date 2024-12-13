/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { PATHROUTES } from "@/helpers/pathroutes";
import {
  validateRegisterStep1,
  validateRegisterStep2,
  validateRegisterStep3,
} from "@/middlewares/validateRegister";
import { registerErrors, registerInputs } from "@/interfaces/interfaces";
import Link from "next/link";
import TermsAndConditions from "../termsAndConditions/TermsAndConditions";
import "./style.css";
const RegisterForm = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [step, setStep] = useState<number>(1);

  const [userData, setUserData] = useState<registerInputs>({
    name: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    healthcareSystem: "",
    idAfiliado: "",
    age: "",
    role: "patient",
  });

  const [errors, setErrors] = useState<registerErrors>({});

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    let newUserErrors: registerErrors = {};

    if (step === 1) {
      newUserErrors = validateRegisterStep1(userData);
    } else if (step === 2) {
      newUserErrors = validateRegisterStep2(userData);
    }

    setErrors(newUserErrors);

    if (Object.keys(newUserErrors).length > 0) {
      return;
    }

    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    const newUser = { ...userData, [name]: value };
    setUserData(newUser);

    let newUserErrors: registerErrors = {};
    if (step === 1) {
      newUserErrors = validateRegisterStep1(newUser);
    } else if (step === 2) {
      newUserErrors = validateRegisterStep2(newUser);
    } else if (step === 3) {
      newUserErrors = validateRegisterStep3(newUser);
    }

    setErrors(newUserErrors);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();

    const newUserErrors = validateRegisterStep1(userData);
    setErrors(newUserErrors);
    console.log(userData);

    if (Object.keys(newUserErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register/api`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario registrado, Inicia sesión!",
          showConfirmButton: true,
        }).then(() => {
          router.push(PATHROUTES.LOGIN);
        });
      } else if (response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El correo electrónico ya está registrado. Inicia sesión",
          confirmButtonColor: "#2b4168",
        }).then(() => {
          setStep(1);
        });
      } else {
        throw new Error("Datos invalidos");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Problema al intentar registrarte, intenta de nuevo",
        confirmButtonColor: "#2b4168",
      });
    }

    setUserData({
      name: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      password: "",
      role: "patient",
      healthcareSystem: "",
      idAfiliado: "",
      age: "",
    });
  };

  return (
    <>
      {step === 1 && (
        <>
          <div className="flex items-center justify-center mt-6 mb-16">
            <div className="border border-acent bg-secundary text-primary rounded-full  h-10 w-10 flex items-center justify-center">
              1
            </div>

            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border bg-secundary rounded-full text-gray-400 h-10 w-10 flex items-center justify-center">
              2
            </div>
            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border bg-secundary rounded-full text-gray-400 h-10 w-10 flex items-center justify-center">
              3
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" flex flex-col space-y-7 max-w-6xl mx-auto"
            action=""
          >
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <div className="space-y-2">
                <label
                  className=" block text-start text-base font-medium text-[#07074D]"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  value={userData.name}
                  onChange={handleChange}
                  className=" rounded-xl text-center md:min-w-[280px] border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="text"
                  name="name"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className=" block text-start text-base font-medium text-[#07074D]"
                  htmlFor="lastName"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className=" rounded-xl text-center md:min-w-[280px] border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="text"
                  name="lastName"
                  required
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <div className="space-y-2">
                <label
                  className="block text-start text-base font-medium text-[#07074D]"
                  htmlFor="gender"
                >
                  Sexo
                </label>
                <select
                  id="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="w-full md:w-auto md:min-w-[280px] rounded-xl text-center border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md appearance-none"
                  name="gender"
                  required
                >
                  <option value=""></option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-600">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className=" block text-start text-base font-medium text-[#07074D]"
                  htmlFor="phone"
                >
                  Telefono
                </label>
                <input
                  id="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="rounded-xl text-center md:min-w-[280px] border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="string"
                  name="phone"
                  required
                />
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <div className="space-y-2">
                <label
                  className="block text-start text-base font-medium text-[#07074D]"
                  htmlFor="age"
                >
                  Edad
                </label>
                <input
                  id="age"
                  value={userData.age}
                  onChange={handleChange}
                  className="rounded-xl text-center md:min-w-[280px] border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="string"
                  name="age"
                  required
                />
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.age}</p>
                )}
              </div>
            </div>

            <div className="flex">
              <button
                className="md:w-1/2 mt-8 md:mx-auto hover:shadow-form rounded-full purple py-3 px-8 text-center text-base font-semibold text-white outline-none"
                onClick={nextStep}
              >
                Siguiente
              </button>
            </div>
          </form>
          <p className="text-center m-6">
            ¿Ya tienes cuenta?
            <Link href={"/auth/signin"}>
              <span className="text-acent font-medium"> inicia sesión</span>
            </Link>
          </p>
        </>
      )}

      {step === 2 && (
        <div className="flex flex-col mt-6">
          <div className="flex justify-center  items-center">
            <div className="border bg-acent rounded-full text-white h-10 w-10 flex items-center justify-center">
              1
            </div>
            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border border-acent bg-secundary text-acent rounded-full  h-10 w-10 flex items-center justify-center">
              2
            </div>
            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border bg-secundary rounded-full text-gray-400 h-10 w-10 flex items-center justify-center">
              3
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-20 space-y-5 max-w-6xl md:min-w-[50rem] mx-auto"
            action=""
          >
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <label
                  className="md:w-1/2 mx-auto block text-start text-base font-medium text-[#07074D]"
                  htmlFor="healthcareSystem"
                >
                  Obra social
                </label>
                <select
                  id="healthcareSystem"
                  value={userData.healthcareSystem}
                  onChange={handleChange}
                  className="md:w-1/2 mx-auto select-custom w-full flex rounded-xl text-center border border-borderInput/50 bg-white py-3 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  name="healthcareSystem"
                  required
                >
                  <option value="" disabled></option>
                  <option value="6744d95a6d87602e47fc2810">Osecac</option>
                  <option value="6744d9766d87602e47fc2812">
                    Prevencion salud
                  </option>
                  <option value="6744d9966d87602e47fc2814">Ospe</option>
                  <option value="6744d9aa6d87602e47fc2816">Avalian</option>
                  <option value="6744d9be6d87602e47fc2818">Osde</option>
                  <option value="6744d9d16d87602e47fc281a">Osuthgra</option>
                  <option value="6744d9e66d87602e47fc281c">Luis Pasteur</option>
                </select>
                {errors.name && (
                  <p className="text-xs text-red-600">
                    {errors.healthcareSystem}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="md:w-1/2 mx-auto block text-start text-base font-medium text-[#07074D]"
                  htmlFor="idAfiliado"
                >
                  Numero de afiliado
                </label>
                <input
                  id="idAfiliado"
                  value={userData.idAfiliado}
                  onChange={handleChange}
                  className="md:w-1/2 mx-auto mb-6 flex rounded-xl text-center border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="number"
                  name="idAfiliado"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.idAfiliado}</p>
                )}
              </div>
            </div>

            <div className="flex  justify-center ">
              <div className="flex mt-28  flex-col md:flex-row  md:space-0 md:space-x-4">
                <button
                  onClick={prevStep}
                  className=" w-full md:w-[360px] mx-auto hover:shadow-form rounded-full bg-secundary text-primary py-3 px-8 text-center text-base font-semibold  outline-none"
                >
                  Volver
                </button>
                <button
                  onClick={nextStep}
                  className="w-full md:w-[360px] mx-auto hover:shadow-form rounded-full purple py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <>
          <div className="flex items-center justify-center mt-6">
            <div className="border bg-acent rounded-full text-white h-10 w-10 flex items-center justify-center">
              1
            </div>
            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border bg-acent rounded-full text-white h-10 w-10 flex items-center justify-center">
              2
            </div>
            <div className="h-0.5 w-16 bg-acent"></div>
            <div className="border border-acent bg-secundary text-acent rounded-full h-10 w-10 flex items-center justify-center">
              3
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-20 space-y-5 max-w-6xl md:min-w-[50rem] mx-auto"
          >
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <label
                  className="md:w-1/2 mx-auto block text-start text-base font-medium text-[#07074D]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="md:w-1/2 mx-auto w-full flex rounded-xl text-center border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="email"
                  name="email"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="md:w-1/2 mx-auto block text-start text-base font-medium text-[#07074D]"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="md:w-1/2 mx-auto mb-6 flex rounded-xl text-center border border-borderInput/50 bg-white py-3 px-6 text-base font-medium text-textColor outline-none focus:border-[#4a41fe] focus:shadow-md"
                  type="password"
                  name="password"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Checkbox de términos y condiciones */}
            <div className="flex items-center justify-center mt-4">
              <input id="terms" type="checkbox" className="mr-2" required />
              <label htmlFor="terms" className="text-base text-textColor">
                Acepto los{" "}
                <span
                  className="text-acent cursor-pointer underline"
                  onClick={() => setIsOpen(true)}
                >
                  términos y condiciones
                </span>
              </label>
            </div>

            {/* Modal de términos y condiciones */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setIsOpen(false)}
              >
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div
                    className="bg-white py-6 px-10 rounded-lg shadow-lg max-w-3xl w-full relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-12 left-10 text-black text-2xl font-bold hover:text-gray-700"
                    >
                      &lt;
                    </button>

                    <TermsAndConditions />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <div className="flex mt-28 flex-col md:flex-row md:space-0 md:space-x-4">
                <button
                  onClick={prevStep}
                  className="w-full md:w-[360px] mx-auto hover:shadow-form rounded-full bg-secundary text-primary py-3 px-8 text-center text-base font-semibold outline-none"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="w-full md:w-[360px] mx-auto hover:shadow-form rounded-full purple py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default RegisterForm;
