'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { onUserFileUpload } from '@/lib/file';

export function FileUploaderForm() {
  const [state, action] = useFormState(onUserFileUpload, {});

  return (
    <main>
      <h1>File Uploader</h1>
      <form action={action}>
        <input type="file" name="file" />
        <SubmitButton />
        <p>{`state: ${state.isSuccess ? 'successful' : state.error}`}</p>
      </form>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  console.log(pending);

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}

// export function FileUploader() {
//   const [state, formAction] = useFormState(createTodo, initialState);

//   const uploadFile = async () => {
//     if (fileInput.current && fileInput.current.files?.length === 1) {
//       const file = fileInput.current.files[0];
//       console.log(await uploadUserFile(file));
//       // Call your upload function with the file
//     }
//   };

//   return (
//     <main>
//       <h1>File Uploader</h1>
//       <input type="file" name="file" ref={fileInput} />
//       <button onClick={uploadFile}>Upload</button>
//     </main>
//   );
// }
