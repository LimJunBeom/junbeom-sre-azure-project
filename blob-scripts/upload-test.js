const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

// 환경 변수에서 연결 문자열 가져오기
const connectionString = process.env.STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage;
const containerName = 'images';

async function uploadImage(filePath) {
    try {
        // Blob Service Client 생성
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 컨테이너가 없으면 생성
        await containerClient.createIfNotExists();

        // 파일명 추출
        const fileName = path.basename(filePath);
        const blobName = `${Date.now()}-${fileName}`;

        // Blob Client 생성
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // 파일 읽기
        const fileBuffer = fs.readFileSync(filePath);

        // Blob 업로드
        console.log(`Uploading ${fileName} to blob storage...`);
        const uploadResult = await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
            blobHTTPHeaders: {
                blobContentType: getContentType(fileName)
            }
        });

        console.log(`Upload successful!`);
        console.log(`Blob name: ${blobName}`);
        console.log(`ETag: ${uploadResult.etag}`);
        console.log(`URL: ${blockBlobClient.url}`);

        return {
            blobName: blobName,
            url: blockBlobClient.url,
            etag: uploadResult.etag
        };

    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

async function listImages() {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        console.log('Listing images in container:');
        for await (const blob of containerClient.listBlobsFlat()) {
            console.log(`- ${blob.name} (${blob.properties.contentLength} bytes)`);
        }
    } catch (error) {
        console.error('Error listing images:', error);
    }
}

async function listThumbnails() {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient('thumbnails');

        console.log('Listing thumbnails in container:');
        for await (const blob of containerClient.listBlobsFlat()) {
            console.log(`- ${blob.name} (${blob.properties.contentLength} bytes)`);
        }
    } catch (error) {
        console.error('Error listing thumbnails:', error);
    }
}

// 메인 실행 함수
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!connectionString) {
        console.error('STORAGE_CONNECTION_STRING or AzureWebJobsStorage environment variable is required');
        process.exit(1);
    }

    switch (command) {
        case 'upload':
            if (args.length < 2) {
                console.error('Usage: node upload-test.js upload <image-file-path>');
                process.exit(1);
            }
            const filePath = args[1];
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                process.exit(1);
            }
            await uploadImage(filePath);
            break;

        case 'list':
            await listImages();
            break;

        case 'thumbnails':
            await listThumbnails();
            break;

        default:
            console.log('Usage:');
            console.log('  node upload-test.js upload <image-file-path>  - Upload an image');
            console.log('  node upload-test.js list                      - List all images');
            console.log('  node upload-test.js thumbnails                - List all thumbnails');
            break;
    }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    uploadImage,
    listImages,
    listThumbnails
};
