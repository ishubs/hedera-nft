import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import axios from 'axios'; // You will need axios to handle the file upload manually

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMDAxOWI5My1lNTRiLTRmNWMtYTc1YS1iMTA1ODQ3OGI2ZWQiLCJlbWFpbCI6InNodWJzZ2lyaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2EwMGNlOTE4N2VlOWNlZmQxMTciLCJzY29wZWRLZXlTZWNyZXQiOiJlYTFmNjYwNTk0NGQ3YTNmMjljYzAwZDYwM2UyYzZiNmE1M2ExZDRjZTY2YTQ5YjNlYjA2NzA1MmRiOWFmNTA4IiwiZXhwIjoxNzU3Nzg0Mzk2fQ.vmvpGzMhrFl3gR5oN_sY7MZD2cBTHEqEph6zLTj_Dtw"
// Replace with your Pinata API key and secret
const PINATA_API_KEY = '3a00ce9187ee9cefd117';
const PINATA_SECRET_KEY = 'ea1f6605944d7a3f29cc00d603e2c6b6a53a1d4ce66a49b3eb067052db9af508';

const uploadToPinata = async (file: File) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    });
    return response.data; // Adjust this based on the response structure
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

const App: React.FC = () => {
  const handleChange = async (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      try {
        const result = await uploadToPinata(info.file.originFileObj);
        message.success(`File uploaded successfully: ${result.IpfsHash}`);
      } catch (error) {
        message.error('File upload failed.');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const props: UploadProps = {
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadToPinata(file);
        onSuccess?.(file);
      } catch (error) {
        onError?.(error);
      }
    },
    onChange: handleChange,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default App;
