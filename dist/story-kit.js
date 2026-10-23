export function createStoryKit(translations) {
  const p = (pair) => {
    const [zh, en] = pair.split("|");
    if (!zh || !en) throw Error("Missing bilingual story text");
    translations[zh] = en;
    return zh;
  };
  const makeStory = (name, time, note, endings, rows) => {
    if (rows.length !== 8 || endings.length !== 3)
      throw Error("Invalid story structure");
    const build = ([
      title,
      context,
      a,
      b,
      afterA,
      afterB,
      effectA = [12, 6, -2],
      effectB = [-9, 2, 17],
    ]) => [
      p(title),
      p(context),
      [
        [p(a), p(afterA), effectA],
        [p(b), p(afterB), effectB],
      ],
      [p(afterA), p(afterB)],
    ];
    return {
      name: p(name),
      time: p(time),
      note: p(note),
      endings: endings.map(p),
      chapters: Array.from({ length: 4 }, (_, i) =>
        rows.slice(i * 2, i * 2 + 2).map(build),
      ),
    };
  };
  return { p, makeStory };
}
