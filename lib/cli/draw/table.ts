import { table } from "table";

export function itable(data: any[]) {
    console.log(
        table(data, {
            drawHorizontalLine: (index: number, size: number) => {
                return index === 0 || index === 1 || index === size;
            }
        })
    );
}
