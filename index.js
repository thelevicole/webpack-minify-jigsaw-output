'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const argv = require( 'yargs' ).argv;
const minifier = require( 'html-minifier' ).minify;

class MinifyLaravelJigsawOutputPlugin {

    constructor( options = {} ) {
        this.options  = options;
        this.env      = this.options.env || argv.env || 'local';
        this.inPath   = this.getPath( this.options.input || `./build_${this.env}` );
        this.outPath  = this.getPath( this.options.output || this.inPath );
        this.pattern  = this.options.test || /\.html$/;
        this.encoding = this.options.encoding || 'utf8';
        this.rules    = this.options.rules || { collapseWhitespace: true };
    }

    getPath( string ) {
        if ( fs.existsSync( string ) ) {
            return path.normalize( string );
        }
    }

    log( string, type = 'log' ) {
        if ( this.options.verbose ) {
            console[ type ]( string );
        }
    }

    minfifyOutput( inDir, outDir ) {

        outDir = outDir || inDir;

        fs.readdir( inDir, ( error, files ) => {
            if ( error ) {
                throw error;
            }

            files.forEach( file => {
                let inputFile = path.resolve( inDir, file );

                if ( fs.statSync( inputFile ).isDirectory() ) {
                    this.minfifyOutput( inputFile, path.resolve( outDir, file ) );
                } else {

                    let source = fs.readFileSync( inputFile, this.encoding );

                    if ( this.pattern.test( inputFile ) ) {
                        this.log( `Minifing ${inputFile}` );
                        let result = minifier( source, this.rules );
                        let outputFile = path.resolve( outDir, file );
                        fs.writeFileSync( outputFile, result );
                    }
                }
            } );
        } );
    }

    apply( compiler ) {
        compiler.hooks.jigsawWebpackBuildDone.tap( 'MinifyLaravelJigsawOutputPlugin', () => {

            this.log( 'Starting to minimize output...' );

            if ( !this.inPath ) {
                var err = `Input location "${this.options.input || 'build_' + this.env}" does not exist.`;
                this.log( err, 'warn' );
                throw new Error( err );
            }

            const inDir = path.resolve( this.inPath );
            const outDir = path.resolve( this.outPath );

            this.minfifyOutput( inDir, outDir );

        } );
    }
}

module.exports = MinifyLaravelJigsawOutputPlugin;
