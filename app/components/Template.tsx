"use client";

import { EmailTemplate } from '@/database/models';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import Spinner from './Modals/Spinner';
import { orderCompleteTemplate } from '@/lib/templates/order';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading...</p> });

const Template = ({ template }: { template: EmailTemplate | undefined }) => {
  const [subject, setSubject] = useState(template?.subject || 'Order Fulfilled!');
  const [body, setBody] = useState(template?.body || orderCompleteTemplate);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
  };

  const createTemplate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (subject.trim() === '' || body.trim() === '') {
      throw new Error('Both subject and body are required');
    }
    const response = await fetch(`/api/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, body })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while saving the email template');
    }
  };

  const { mutate: handleCreateTemplate, isPending: loading } = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      showSuccessToast('Template saved successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateTemplate();
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
      ],
    },
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 mt-[5.5rem] mb-4">
      <div className="w-full p-6 bg-white shadow-md rounded-lg max-w-6xl">
        <h2 className="text-lg font-semibold mb-4">Create Email Template</h2>
        <div className="mb-4 bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Instructions:</p>
          <ul className="list-disc ml-4">
            <li>Customize the template as needed to match your style.</li>
            <li>Please do not remove/modify any placeholders and directives (e.g., {'{{#each OrderItems}}'}, {'{{#each this.Cards}}'}, {'{{/each}}'}, {'{{inc @index}}'}).</li>
            <li>The system will automatically populate dynamic values.</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" id="subject" name="subject" value={subject} onChange={handleSubjectChange} disabled={loading} className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">Body</label>
            <QuillEditor theme="snow" id="body" modules={modules} value={body} onChange={handleBodyChange} className="bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Save Template</button>
        </form>
      </div>
    </div>
  );
};

export default Template;