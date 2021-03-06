import { Grammarly } from "@stewartmcgown/grammarly-api";

const text = `When we have shuffled off this mortal coil,
Must give us pause - their's the respect
That makes calamity of so long life.`;

const free = new Grammarly();

const results = await free.analyse(text);

console.log(results);