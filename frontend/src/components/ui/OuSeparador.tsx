type ouSeparadorProps = {
  strVisivel?: boolean;
};
export default function OuSeparador({ strVisivel }: ouSeparadorProps) {
  return (
    <div className="relative flex items-center justify-center text-xs uppercase w-full">
      <div className="flex-1 border-t border-white dark:border-gray-400"></div>

      {strVisivel && <span className="px-2 text-muted-foreground">ou</span>}

      <div className="flex-1 border-t border-white dark:border-gray-400"></div>
    </div>
  );
}
