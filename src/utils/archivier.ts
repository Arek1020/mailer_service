import * as fs from 'fs';
import archiver, { ArchiverOptions, Format } from 'archiver';
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));
interface CustomArchiverOptions extends ArchiverOptions {
    encryptionMethod?: string;
}

export const archive = (sourceFolderPath: string, archiveFilePath: string, password: string) => {
    // Create a write stream for the archive file
    const output = fs.createWriteStream(archiveFilePath);
    // Create a new archiver instance
    const archive = archiver('zip-encrypted' as Format, {
        zlib: { level: 9 },
        encryptionMethod: 'aes256',
        password: password
    } as CustomArchiverOptions);
    // Pipe the archive data to the file
    archive.pipe(output);
    // Add files to the archive
    archive.directory(sourceFolderPath, false); // The second parameter indicates whether to preserve the folder structure
    // Finalize the archive
    archive.finalize();
    // Handle events
    output.on('close', () => {
        console.info(`${archive.pointer()} total bytes archived`);
        console.info('Archiving completed successfully');
        removeFolder(sourceFolderPath)
    });

    archive.on('warning', (err: archiver.ArchiverError) => {
        if (err.code === 'ENOENT') {
            console.warn('Warning: File not found or empty folder');
        } else {
            throw err;
        }
    });

    archive.on('error', (err: archiver.ArchiverError) => {
        throw err;
    });
}

const removeFolder = (folderPath: string) => {
    if (fs.existsSync(folderPath)) {
        try {
            // Remove the folder
            fs.rmSync(folderPath, { recursive: true });
            console.info('Folder deleted successfully.');
        } catch (err) {
            console.error('Error deleting folder:', err);
        }
    } else {
        console.log('Folder does not exist.');
    }
}