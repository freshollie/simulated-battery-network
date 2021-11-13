const maxSoc = 10;

const battery = {
  socMwh: 5,
  history: [] as Array<{time: Date; volumeMwh: number}>,
};

export const charge = async (volumeMwh: number, time?: Date) => {
  if (battery.socMwh + volumeMwh > maxSoc) {
    throw new Error('Charge volume will be larger than max battery capacity');
  }

  battery.history.push({time: time ?? new Date(), volumeMwh});
  battery.socMwh += volumeMwh;
};

export const discharge = async (volumeMwh: number, time?: Date) => {
  if (battery.socMwh - volumeMwh < 0) {
    throw new Error('Discharge volume is larger than battery soc');
  }

  battery.history.push({time: time ?? new Date(), volumeMwh: -volumeMwh});
  battery.socMwh -= volumeMwh;
};

export const getSoc = async (): Promise<number> => {
  return battery.socMwh;
};

export const getThroughputBetween = async (
  from: Date,
  to: Date,
): Promise<{exportMwh: number; importMwh: number}> => {
  const segment = battery.history.filter(
    ({time}) =>
      time.getTime() >= from.getTime() && time.getTime() <= to.getTime(),
  );

  return {
    exportMwh: segment
      .filter(({volumeMwh}) => volumeMwh < 0)
      .reduce((acc, {volumeMwh}) => acc + volumeMwh * -1, 0),
    importMwh: segment
      .filter(({volumeMwh}) => volumeMwh > 0)
      .reduce((acc, {volumeMwh}) => acc + volumeMwh, 0),
  };
};

export const reset = () => {
  battery.history = [];
  battery.socMwh = 5;
};
