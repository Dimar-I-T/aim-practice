'use client'
import { Input } from "@/components/ui/input";
import { M_PLUS_1 } from "next/font/google";
import Image from "next/image";
import React, { ReactHTMLElement, useEffect, useRef, useState } from "react";

interface StatsType {
  Targets: number,
  Kills: number,
  KillsPerRound: number,
  Misses: number,
  Accuracy: number,
}

export default function Home() {
  const [position, setPosition] = useState<number[]>([0, 0]);
  const [scope, setScope] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [hidup, setHidup] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);
  const [posisiTarget, setPosisiTarget] = useState<number[][]>([[100, 100]]);
  const [v, setV] = useState<number>(3);
  const [maxTarget, setMaxTarget] = useState<number>(4);
  const penambah = useRef<number[]>([1]);
  const penambahY = useRef<number[]>([1]);
  const [horiver, setHoriver] = useState<number[]>([1, 0]);
  // x-axis, y-axis, random, velocity
  const [input, setInput] = useState<number[]>([0, 0, 0, 0]);
  const inputString = ['x-axis', 'y-axis', 'random', 'velocity'];
  const [stats, setStats] = useState<StatsType>({ Targets: 1, Kills: 0, KillsPerRound: 0, Misses: 0, Accuracy: 1 });
  const [hidupArr, setHidupArr] = useState<number[]>([1])
  const pen = [-1, 1];

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

  const Stats = Object.entries(stats).map(([key, value]) => {
    let val = value;
    let persen: string = "";
    if (key == "Accuracy") {
      val *= 100;
      persen = "%";
    }

    return (
      <div key={key} className="flex grid-cols-2 gap-1">
        <h1 className="left-0 top-0 m-[10px] text-black font-bold text-[20px]">
          {key}:&nbsp;{Math.round(val)}{persen}
        </h1>
      </div>
    )
  })

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
      // for (let x = 0; x < stats.Targets; x++) {
      //   if (posisiTarget[x][0] < 0) {
      //     penambah.current = -1;
      //   }
      //   if (posisiTarget[x][0] > window.innerWidth) {
      //     penambah.current = 1;
      //   }
      //   if (posisiTarget[x][1] < 0) {
      //     penambahY.current = -1;
      //   }
      //   if (posisiTarget[x][1] > window.innerHeight) {
      //     penambahY.current = 1;
      //   }

      //   setPosisiTarget(prev => {
      //     prev[x] = [prev[x][0] - input[0] * penambah.current * v, prev[x][1] - input[1] * penambahY.current * v]
      //     return prev;
      //   });
      // }

      setPosisiTarget(prev => {
        const update = prev.map((vv, i) => {
          if (vv[0] < 0) {
            penambah.current[i] = -1;
          }
          if (vv[0] > window.innerWidth) {
            penambah.current[i] = 1;
          }
          if (vv[1] < 0) {
            penambahY.current[i] = -1;
          }
          if (vv[1] > window.innerHeight) {
            penambahY.current[i] = 1;
          }

          return [prev[i][0] - input[0] * penambah.current[i] * v, prev[i][1] - input[1] * penambahY.current[i] * v]
        })

        return update;
      })

      animationRef.current = requestAnimationFrame(animate);
    }


    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [posisiTarget])

  const mati = (i: number) => {
    if (scope) {
      let b: StatsType = stats;
      let b1: number[] = hidupArr;
      b1[i] = 0;
      b.Kills++;
      b.KillsPerRound++;
      b.Accuracy = b.Kills / (b.Kills + b.Misses);
      setHidupArr(b1);
      setStats(b);
    }

    if (stats.KillsPerRound == stats.Targets) {
      setTimeout(() => {
        setHoriver([getRandom(2), getRandom(2)]);
        if (input[2] == 1) {
          let baru: number[] = [...input];
          baru[0] = getRandom(2);
          baru[1] = getRandom(2);
          setInput(baru);
        }

        let b: StatsType = stats;
        let banyakTargetB = 1 + getRandom(maxTarget);
        b.KillsPerRound = 0;
        b.Targets = banyakTargetB;
        let h: number[] = Array(banyakTargetB).fill(1);
        setPosisiTarget(Array(banyakTargetB).fill([100, 100]));
        penambah.current = Array(banyakTargetB).fill(1);
        penambahY.current = Array(banyakTargetB).fill(1);
        for (let i = 0; i < banyakTargetB; i++) {
          let x = Math.floor(Math.random() * window.innerWidth);
          let y = Math.floor(Math.random() * window.innerHeight);
          let b: number[][] = posisiTarget;
          penambah.current[i] = pen[getRandom(2)];
          penambahY.current[i] = pen[getRandom(2)];
          b[i] = [x, y];
          setPosisiTarget(b);
        }

        setStats(b);
        setHidupArr(h);
      }, 500)
    }
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    try {
      setV(Number(e.currentTarget.value));
    } catch {
      alert("bukan angka")
    }
  }

  const MissClick = () => {
    if (scope && hidup) {
      let b: StatsType = stats;
      b.Accuracy = b.Kills / (b.Kills + b.Misses);
      b.Misses++;
      setStats(b);
    }
  }

  const Buttons = Array.from({ length: stats.Targets }, (_, i) => {
    return (<button key={i}
      onMouseDown={() => mati(i)}
      className={`absolute rounded-full bg-red-800 w-10 h-10 ${hidupArr[i] ? "" : "hidden"} z-50`}
      style={
        {
          left: `${posisiTarget[i][0]}px`,
          top: `${posisiTarget[i][1]}px`,
          transform: 'translate(-50%, -50%)'
        }
      }
    >

    </button>)
  })

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen bg-blue-200 overflow-hidden ${scope ? "cursor-none" : ""}`}>
      {!scope &&
        <>
          <h1 className="absolute left-0 top-0 m-[10px] text-black font-bold text-[20px] z-20">
            Press E to activate the scope
          </h1>

          <div className="absolute top-[40px] bg-transparent m-[10px] grid-rows-5 border-[black] border-5 w-[280px] h-auto z-20">
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
            <div className="flex grid-cols-2 gap-1">
              <h1 className="left-0 top-0 m-[10px] text-black font-bold text-[20px]">
                max targets:
              </h1>
              <Input
                className="w-15 h-8 mt-2 bg-white text-black border-white"
                value={maxTarget}
                onChange={(e) => {
                  try{setMaxTarget(Number(e.currentTarget.value))}
                  catch{alert("bukan angka")};
                }}
              >
              </Input>
            </div>
          </div>

          <h1 className="absolute top-0 right-0 mr-[200px] m-[10px] text-black font-bold text-[20px]">
            Statistics
          </h1>

          <div className="absolute right-0 top-[40px] bg-transparent m-[10px] border-[black] border-5 w-[280px] h-auto">
            <>{Stats}</>
          </div>
        </>
      }
      <button
        onClick={MissClick}
        className="absolute bg-transparent w-[3000px] h-[3000px] border-transparent overflow-hidden z-0"
        style={{
          userSelect: "none"
        }}
      >
      </button>
      {scope &&
        <Image
          src="/scope2.png"
          alt="sLogo"
          width={5760}
          height={3240}
          className="object-cover w-[5760] h-[3240] pointer-events-none fixed z-60"
          style={
            {
              left: position[0],
              top: position[1],
              transform: 'translate(-50%, -50%) rotate(-90deg)',
              userSelect: 'none'
            }
          }
        />}

      <>{Buttons}</>

      {/* <button
        onMouseDown={mati}
        className={`absolute rounded-full bg-red-800 w-10 h-10 ${hidup ? "" : "hidden"} z-50`}
        style={
          {
            left: `${posisiTarget[0]}px`,
            top: `${posisiTarget[1]}px`,
            transform: 'translate(-50%, -50%)'
          }
        }
      >

      </button> */}

    </div>
  );
}
