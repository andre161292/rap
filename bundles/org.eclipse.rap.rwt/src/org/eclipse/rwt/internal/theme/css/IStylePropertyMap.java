/*******************************************************************************
 * Copyright (c) 2008 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/
package org.eclipse.rwt.internal.theme.css;

import org.eclipse.rwt.internal.theme.*;


/**
 * Contains all properties in a css rule block.
 */
public interface IStylePropertyMap {

  public abstract String[] getProperties();
  
  public QxType getValue( final String property, final ResourceLoader loader );

  public QxFont getFont( final String propertyName );

  public QxBorder getBorder( final String propertyName );

  public QxBoxDimensions getBoxDimensions( final String propertyName );

  public QxDimension getDimension( final String propertyName );

  public QxColor getColor( final String propertyName );

  public QxImage getBackgroundImage( final String propertyName, final ResourceLoader loader );
}
