export function Username({ username }: { username: string }) {
  return (
    <span className='text-h50 block max-w-[15ch] truncate overflow-hidden whitespace-nowrap drop-shadow-md'>
      {username}
    </span>
  );
}
