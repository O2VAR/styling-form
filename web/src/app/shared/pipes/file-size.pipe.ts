
import { Pipe, PipeTransform } from '@angular/core';

// https://gist.github.com/JonCatmull/ecdf9441aaa37336d9ae2c7f9cb7289a

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}