package org.my.sample;

import io.quarkus.test.junit.NativeImageTest;

@NativeImageTest
public class NativeMySampleIT extends MySampleTest {

    // Execute the same tests but in native mode.
}