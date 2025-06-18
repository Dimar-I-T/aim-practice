'use client'
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { ReactHTMLElement, useEffect, useRef, useState } from "react";

export default function Home() {
  const [position, setPosition] = useState<number[]>([0, 0]);
  const [scope, setScope] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [hidup, setHidup] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);
  const [posisiTarget, setPosisiTarget] = useState<number[]>([100, 100]);
  const [v, setV] = useState<number>(3);
  const penambah = useRef(1);
  const penambahY = useRef(1);
  const [horiver, setHoriver] = useState<number[]>([1, 0]);
  // x-axis, y-axis, random, velocity
  const [input, setInput] = useState<number[]>([0, 0, 0, 0]);
  const inputString = ['x-axis', 'y-axis', 'random', 'velocity'];

  function aktif(i: number) {
    let baru: number[] = [...input]
    baru[i] = (baru[i] == 1) ? 0 : 1;
    setInput(baru)
  }

  function InputK(i: number) {
    return (
      <div className="flex grid-cols-2 gap-1">
        <h1 className="left-0 top-0 m-[10px] text-black font-bold text-[20px]">
          {inputString[i]}
        </h1>
        <button onClick={() => aktif(i)} className="w-8 h-8 mt-2 bg-transparent">
          <Image
            src={`${input[i] ? "/switchOn.png" : "/switchOff.png"}`}
            alt="sLogo"
            width={5760}
            height={3240}
            style={{
              userSelect: "none"
            }}
          />
        </button>
      </div>
    )
  }

  function getRandom(x: number) {
    return Math.floor(Math.random() * x);
  }

  useEffect(() => {
    const ubahPosisiMouse = (e: MouseEvent) => {
      setPosition([e.clientX, e.clientY]);
    }

    window.addEventListener('mousemove', ubahPosisiMouse);
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        setScope(prev => !prev);
      }
    })

    return () => {
      window.removeEventListener('mousemove', ubahPosisiMouse);
    };
  }, [])

  useEffect(() => {
    const animate = () => {
      if (posisiTarget[0] < 0) {
        penambah.current = -1;
      }
      if (posisiTarget[0] > window.innerWidth) {
        penambah.current = 1;
      }
      if (posisiTarget[1] < 0) {
        penambahY.current = -1;
      }
      if (posisiTarget[1] > window.innerHeight) {
        penambahY.current = 1;
      }

      setPosisiTarget(prev => {
        return [prev[0] - input[0] * penambah.current * v, prev[1] - input[1] * penambahY.current * v];
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [posisiTarget])

  useEffect(() => {
    if (!hidup) {
      setTimeout(() => {
        let x = Math.floor(Math.random() * window.innerWidth);
        let y = Math.floor(Math.random() * window.innerHeight);
        setPosisiTarget([x, y]);
        setHoriver([getRandom(2), getRandom(2)]);
        if (input[2] == 1) {
          let baru: number[] = [...input];
          baru[0] = getRandom(2);
          baru[1] = getRandom(2);
          setInput(baru);
        }

        setHidup(true);
      }, 500)
    }
  }, [hidup])

  const mati = () => {
    if (scope) {
      setHidup(false);
    }
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    try{
      setV(Number(e.currentTarget.value));
    }catch{
      alert("bukan angka")
    }
  }

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen bg-blue-200 overflow-hidden ${scope ? "cursor-none" : ""}`}>
      {scope &&
        <Image
          src="/scope2.png"
          alt="sLogo"
          width={5760}
          height={3240}
          className="object-cover w-[5760] h-[3240] pointer-events-none fixed z-10"
          style={
            {
              left: position[0],
              top: position[1],
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              userSelect: 'none'
            }
          }
        />}

      <button
        onMouseDown={mati}
        className={`absolute rounded-full bg-red-800 w-10 h-10 ${hidup ? "" : "hidden"}`}
        style={
          {
            left: `${posisiTarget[0]}px`,
            top: `${posisiTarget[1]}px`,
            transform: 'translate(-50%, -50%)'
          }
        }
      >

      </button>
      {!scope &&
        <>
          <h1 className="left-0 top-0 m-[10px] text-black font-bold text-[20px]">
            Press E to activate the scope
          </h1>

          <div className="bg-transparent m-[10px] grid-rows-4 border-[black] border-5 w-[280px] h-auto">
            {InputK(2)}
            {!input[2] && InputK(0)}
            {!input[2] && InputK(1)}
            <div className="flex grid-cols-2 gap-1">
              <h1 className="left-0 top-0 m-[10px] text-black font-bold text-[20px]">
                velocity:
              </h1>
              <Input 
                className="w-15 h-8 mt-2 bg-white text-black border-white"
                value={v}
                onChange={(e) => handleChange(e)}
                >
              </Input>
            </div>
          </div>
        </>
      }
    </div>
  );
}
