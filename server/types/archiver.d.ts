declare module 'archiver' {
  import { Transform } from 'stream';
  
  interface ArchiverOptions {
    zlib?: {
      level?: number;
    };
  }
  
  interface Archive extends Transform {
    pipe(destination: NodeJS.WritableStream): NodeJS.WritableStream;
    append(source: string | Buffer | NodeJS.ReadableStream, name: { name: string } | string): this;
    directory(directory: string, destination: string): this;
    file(file: string, options: { name: string }): this;
    finalize(): Promise<void>;
    pointer(): number;
    on(event: string, listener: Function): this;
  }
  
  function archiver(format: string, options?: ArchiverOptions): Archive;
  
  export = archiver;
}